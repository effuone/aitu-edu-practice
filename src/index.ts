import * as fs from 'fs/promises';
import { PrismaClient } from '@prisma/client';
import convertToYolo from './utils/convertToYolo';

const prisma = new PrismaClient();

const userEmail = '230719@astanait.edu.kz'; // this is my AITU barcode email, change for your own one
const filePath = './main_sample.json';

const main = async () => {
  const sampleJsonData = JSON.parse(
    await fs.readFile(filePath, {
      encoding: 'utf-8',
    })
  );

  const onlyMineOnes = sampleJsonData.filter((obj) => {
    return obj.annotations[0].completed_by.email === userEmail;
  });

  const insertedUsers = new Set();

  await prisma.$transaction(async (prisma) => {
    for (const task of onlyMineOnes) {
      const user = task.annotations[0].completed_by;
      if (!insertedUsers.has(user.id)) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {},
          create: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
          },
        });
        insertedUsers.add(user.id);
      }

      await prisma.task.upsert({
        where: { id: task.id },
        update: {},
        create: {
          id: task.id,
          agreement: task.agreement,
          data: task.data,
          meta: task.meta,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at),
          innerId: task.inner_id,
          totalAnnotations: task.total_annotations,
          cancelledAnnotations: task.cancelled_annotations,
          totalPredictions: task.total_predictions,
          commentCount: task.comment_count,
          unresolvedCommentCount: task.unresolved_comment_count,
          lastCommentUpdatedAt: task.last_comment_updated_at
            ? new Date(task.last_comment_updated_at)
            : null,
          projectId: task.project,
          updatedById: task.updated_by,
          commentAuthors: task.comment_authors,
        },
      });

      for (const annotation of task.annotations) {
        await prisma.annotation.upsert({
          where: { id: annotation.id },
          update: {},
          create: {
            id: annotation.id,
            completedById: annotation.completed_by.id,
            result: annotation.result,
            reviews: annotation.reviews,
            wasCancelled: annotation.was_cancelled,
            groundTruth: annotation.ground_truth,
            createdAt: new Date(annotation.created_at),
            updatedAt: new Date(annotation.updated_at),
            draftCreatedAt: annotation.draft_created_at
              ? new Date(annotation.draft_created_at)
              : null,
            leadTime: annotation.lead_time,
            prediction: annotation.prediction,
            resultCount: annotation.result_count,
            uniqueId: annotation.unique_id,
            importId: annotation.import_id,
            lastAction: annotation.last_action,
            taskId: annotation.task,
            projectId: annotation.project,
            updatedById: annotation.updated_by,
            parentPredictionId: annotation.parent_prediction,
            parentAnnotationId: annotation.parent_annotation,
            lastCreatedById: annotation.last_created_by,
          },
        });

        for (const bbox of annotation.result) {
          if (bbox.type === 'rectanglelabels') {
            const label = bbox.value.rectanglelabels[0];
            const { x, y, width, height } = bbox.value;
            const { image } = task.data;
            const originalWidth = bbox.original_width;
            const originalHeight = bbox.original_height;

            const yoloFormat = convertToYolo(
              x,
              y,
              width,
              height,
              originalWidth,
              originalHeight
            );

            await prisma.boundingBoxes.create({
              data: {
                x: yoloFormat[0],
                y: yoloFormat[1],
                width: yoloFormat[2],
                height: yoloFormat[3],
                label,
                image,
                createdAt: new Date(annotation.created_at),
                annotationId: annotation.id,
              },
            });
          }
        }
      }
    }
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log(`Data of user with email ${userEmail} successfully inserted`);
    await prisma.$disconnect();
  });
